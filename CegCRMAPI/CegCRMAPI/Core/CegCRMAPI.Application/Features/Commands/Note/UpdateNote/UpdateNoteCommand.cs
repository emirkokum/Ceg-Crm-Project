using CegCRMAPI.Application.Repositories;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using CegCRMAPI.Application.Services;
using AutoMapper;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.DTOs.Note;

namespace CegCRMAPI.Application.Features.Commands.Note.UpdateNote
{
    public class UpdateNoteCommand : IRequest<ApiResponse<NoteDto>>
    {
        public Guid Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public Guid? CustomerId { get; set; }
        public Guid? LeadId { get; set; }
        public Guid? TicketId { get; set; }
        public Guid? SaleId { get; set; }
        public Guid? TaskId { get; set; }
    }

    public class UpdateNoteCommandHandler : IRequestHandler<UpdateNoteCommand, ApiResponse<NoteDto>>
    {
        private readonly INoteRepository _noteRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public UpdateNoteCommandHandler(INoteRepository noteRepository, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _noteRepository = noteRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<ApiResponse<NoteDto>> Handle(UpdateNoteCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var note = await _noteRepository.GetByIdAsync(request.Id);
                if (note == null)
                    return ApiResponse<NoteDto>.CreateError("Note not found");

                _mapper.Map(request, note);
                _noteRepository.Update(note);
                var noteDto = _mapper.Map<NoteDto>(note);
                return ApiResponse<NoteDto>.CreateSuccess(noteDto, "Note updated successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<NoteDto>.CreateError($"Failed to update note: {ex.Message}");
            }
        }
    }
} 